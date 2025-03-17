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

        stage('Build and Start Services') {
            steps {
                script {
                    sh 'docker-compose down'  // Stop any running containers
                    sh 'docker-compose build' // Build all services
                }
            }
        }

        stage('Run Services') {
            steps {
                sh 'docker-compose up -d'
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
                sh 'docker-compose logs --tail=50'
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

