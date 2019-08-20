podTemplate(
    label: 'mypod',
    containers: [
        containerTemplate(
            name: 'jnlp',
            image: 'jenkins/jnlp-slave:3.27-1-alpine',
            args: '${computer.jnlpmac} ${computer.name}',
            resourceRequestCpu: '500m',
            resourceRequestMemory: '1024Mi',
            resourceLimitCpu: '1000m',
            resourceLimitMemory: '2048Mi'
        ),
        containerTemplate(
            name: 'docker',
            image: 'docker:18.02',
            ttyEnabled: true,
            command: 'cat',
            resourceRequestMemory: '1024Mi'
        ),
        containerTemplate(
            name: 'helm',
            image: 'ibmcom/k8s-helm:v2.6.0',
            ttyEnabled: true,
            command: 'cat'
        )
    ],
    volumes: [
        hostPathVolume(
            hostPath: '/var/run/docker.sock',
            mountPath: '/var/run/docker.sock'
        )
    ]
) {
    node('mypod') {
        def commitId
        stage ('Extract') {
            checkout scm
            commitId = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        }
        def repository
        stage ('Docker') {
            container ('docker') {
                repository = "gcr.io/istioplay/simple-get-weather"
                sh 'ls -la'
                withCredentials([file(credentialsId: 'istioplayfile', variable: 'GC_KEY')]) {
                    echo "${GC_KEY}"
                    sh "cat ${GC_KEY} | docker login -u _json_key --password-stdin https://gcr.io"
                }
                sh "docker build -t ${repository}:${commitId} ."
                sh "docker push ${repository}:${commitId}"
            }
        }
        stage ('Deploy') {
            container ('helm') {
                sh "/helm init --client-only --skip-refresh"
                sh "/helm upgrade --install --wait --set image.tag=${commitId} simple-get-weather deployment"
            }
        }
    }
}
