pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('server') {
                    sh 'npm test'
                }
            }
        }
    }

    post {
        success {
            echo 'Feedback tests passed successfully!'
        }

        failure {
            echo 'Pipeline failed. Please check the errors.'
        }
    }
}