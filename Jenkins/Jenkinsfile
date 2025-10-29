pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Rohan122002/Cloud-Project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker Image for JMeter...'
                    sh 'docker build -t jmeter-docker .'
                }
            }
        }

        stage('Run JMeter Test') {
            steps {
                script {
                    echo 'Running JMeter Test in Docker...'
                    sh 'docker run --rm -v "$PWD/jmeter/results":/jmeter/results jmeter-docker -n -t /jmeter/JPet_store_Sanity.jmx -l /jmeter/results/result.jtl -e -o /jmeter/results/html'
                }
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'jmeter/results/html/**', fingerprint: true
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
    }
}
