pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Rohan122002/Cloud-Project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker Image for JMeter...'
                    bat 'docker build -t jmeter-docker .'
                }
            }
        }

        stage('Run JMeter Test') {
            steps {
                script {
                    echo 'Running JMeter Test in Docker...'
                    bat """
                    docker run --rm ^
                    -v "D:/My computer/Cloud_Project/jmeter/Results":/jmeter/results ^
                    jmeter-docker -n -t /jmeter/JPet_store_Smoke.jmx ^
                    -l /jmeter/results/SMOKE_V1.jtl -e -o /jmeter/results/Smoke_HTML """

                }
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'jmeter/results/html2/**', fingerprint: true
            }
        }
    }

    post {
        always {
            echo 'Pipeline completeddddd very good.'
        }
    }
}
