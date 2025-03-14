# 1️ Base stage: Download dependencies to leverage caching
FROM eclipse-temurin:21-jdk-jammy AS deps
WORKDIR /build

COPY --chmod=0755 mvnw mvnw
COPY .mvn/ .mvn/
COPY pom.xml ./

# Use cache for dependencies
RUN --mount=type=cache,target=/root/.m2 ./mvnw dependency:go-offline -DskipTests

################################################################################

# 2️ Build stage: Compile and package the application
FROM deps AS package
WORKDIR /build
COPY src/ src/
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw package -DskipTests && \
    mv target/*.jar target/app.jar

################################################################################

# 3️ Extract stage: Optimize layers for better caching
FROM package AS extract
WORKDIR /build
RUN java -Djarmode=layertools -jar target/app.jar extract --destination target/extracted

################################################################################

# 4️ Final stage: Minimal runtime with JRE only
FROM eclipse-temurin:21-jre-jammy AS final

# Security: Use a non-root user
ARG UID=10001
RUN adduser --disabled-password --gecos "" --home "/nonexistent" --shell "/sbin/nologin" --no-create-home --uid "${UID}" appuser
USER appuser

# Copy extracted JAR layers separately (better caching)
COPY --from=extract /build/target/extracted/dependencies/ ./
COPY --from=extract /build/target/extracted/spring-boot-loader/ ./
COPY --from=extract /build/target/extracted/snapshot-dependencies/ ./
COPY --from=extract /build/target/extracted/application/ ./

ENTRYPOINT [ "java", "org.springframework.boot.loader.launch.JarLauncher" ]
