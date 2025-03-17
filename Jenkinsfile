pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git credentialsId: 'git-ssh-key', url: 'git@github.com:abhinav-31/ChatAppMicroservice.git', branch: 'main'
            }
        }
        stage('Inject Secrets') {
            steps {
                script {
                    withCredentials([
                        file(credentialsId: 'u-s-env', variable: 'USER_SETTING_ENV'),
                        file(credentialsId: 'c-n-env', variable: 'CHAT_NOTIFICATION_ENV'),
                        file(credentialsId: 'db-env', variable: 'DATABASE_ENV'),
                        file(credentialsId: 'frntd-env', variable: 'FRONTEND_ENV')
                    ]) {
                        sh "cp ${USER_SETTING_ENV} ./ChatAppMicroservice/ChatAppBackend/user_setting_service/"
                        sh "cp ${CHAT_NOTIFICATION_ENV} ./ChatAppMicroservice/ChatAppBackend/chat_notification_service/"
                        sh "cp ${DATABASE_ENV} ./ChatAppMicroservice/ChatAppBackend/"
                        sh "cp ${FRONTEND_ENV} ./ChatAppMicroservice/ChatAppFrontend/"
                    }
                }
            }
        }
        stage('Build and Start Services') {
            steps {
                script {
                    sh 'docker compose down'  // Stop any running containers
                    sh 'docker compose build' // Build all services
                }
            }
        }

        stage('Run Services') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Check Running Containers') {
            steps {
                sh 'docker ps -a'
            }
        }
    }

    post {
        always {
            script {
                sh 'docker compose logs --tail=50'
            }
        }
        failure {
            echo "Build failed. Check logs for details."
        }
        success {
            echo "Deployment successful!"
        }
    }
}

