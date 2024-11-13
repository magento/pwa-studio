@Library(['jenkins-pipeline-libraries', 'magento-saas-pipeline@0.2.0']) _

pipeline {
    agent {
        docker {
            label "worker"
            image "docker-data-solution-jenkins-node-aws-dev.dr-uw2.adobeitc.com/node-aws-magento-cli:12-01"
            args  '-v /etc/passwd:/etc/passwd'
            registryUrl "https://docker-data-solution-jenkins-node-aws-dev.dr-uw2.adobeitc.com"
            registryCredentialsId "artifactory-datasoln"
        }
    }
    environment {
        HOME = "."
        TMPDIR = "./temp"
        NPM_TOKEN = credentials("delorey-npm-token")
        GH_TOKEN = credentials("semantic-release-github-token")
        TESSA2_API_KEY = credentials("tessa2-api-key")
        MAGENTO_CLOUD_CLI_TOKEN = credentials("delorey-magento-cloud-token")
    }
    stages {
        stage("Install") {
          steps {
            sh "npm install"
          }
        }

        stage("Lint") {
            steps {
                sh "npm run lint"
            }
        }
        stage("Test") {
            steps {
                sh "npm run test"
            }
        }
        stage("redeploy cloud") {
            when {
                branch 'master'
            }
            steps {
                withGitSsh('magjenkinscloud') {
                    sh '''
                        rm -Rf mikita-klimiankou-test
                        git clone --branch master 5k2ulbou6q5ti@git.us-4.magento.cloud:5k2ulbou6q5ti.git mikita-klimiankou-test
                        cd mikita-klimiankou-test
                        git config --global user.email "data-solutions-jenkins@adobe.com"
                        git config --global user.name "data-solutions-jenkins"
                        cd app/code
                        rm -f ./dummy*
                        mktemp ./dummyXXXXXX
                        git add .
                        git commit -m "building cloud instance"
                        git push
                        rm -Rf mikita-klimiankou-test
                    '''
                }
            }
        }
    }
    post {
        always {
            slack(currentBuild.result, "#datasolutions-jenkins")
            build job: 'prex_qa_smoke', parameters: [string(name: 'featureTags', value: "\"--tags @pwa\"")], wait: false
        }
    }
}
