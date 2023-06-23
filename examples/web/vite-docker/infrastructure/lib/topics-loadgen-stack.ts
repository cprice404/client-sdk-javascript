import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery';
import {DnsRecordType} from 'aws-cdk-lib/aws-servicediscovery';
import * as path from 'path';
import {Platform} from 'aws-cdk-lib/aws-ecr-assets';
import {Bucket} from 'aws-cdk-lib/aws-s3';

export class TopicsLoadGenStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'TopicsLoadGenVpc', {
      maxAzs: 1,
    });

    const cluster = new ecs.Cluster(this, 'TopicsLoadGenCluster', {
      clusterName: 'topics-loadgen-cluster',
      vpc: vpc,
    });

    const dnsNamespaceName = 'topics.momento';

    const dnsNamespace = new servicediscovery.PrivateDnsNamespace(this, 'topics-loadgen-dns-namespace', {
      name: dnsNamespaceName,
      vpc: vpc,
      description: 'Private Dns namespace for topics loadgen services',
    });

    const topicsLoadGenBrowserRunnerImage = ecs.ContainerImage.fromAsset(path.join(__dirname, '../../chromium'), {
      platform: Platform.LINUX_AMD64,
    });

    const topicsLoadGenWebServerImage = ecs.ContainerImage.fromAsset(path.join(__dirname, '../../vite-project'), {
      platform: Platform.LINUX_AMD64,
    });

    const topicsLoadGenTestBucket = new Bucket(this, 'topics-loadgen-bucket', {
      bucketName: `topics-loadgen-bucket-${this.account}`,
    });

    const topicsLoadGenTaskRole = new iam.Role(this, 'topics-loadgen-task-role', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    const topicsLoadGenSecurityGroup = new ec2.SecurityGroup(this, 'topics-loadgen-security-group', {
      allowAllOutbound: true,
      securityGroupName: 'topics-loadgen-security-group',
      vpc: vpc,
    });
    topicsLoadGenSecurityGroup.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

    topicsLoadGenTestBucket.grantWrite(topicsLoadGenTaskRole);

    const loadGenBrowserRunnerDefinition = new ecs.FargateTaskDefinition(this, 'topics-loadgen-browser-task-def', {
      memoryLimitMiB: 4096,
      taskRole: topicsLoadGenTaskRole,
      cpu: 2048,
      runtimePlatform: {
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        cpuArchitecture: ecs.CpuArchitecture.X86_64,
      },
      family: 'topics-loadgen-browser-runner',
    });

    new ecs.ContainerDefinition(this, 'topics-loadgen-browser-container-definition', {
      taskDefinition: loadGenBrowserRunnerDefinition,
      image: topicsLoadGenBrowserRunnerImage,
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'topics-loadgen-browser-runner',
      }),
    });

    const browserRunnerServiceName = 'browserrunner';
    new ecs.FargateService(this, 'topics-loadgen-browser-runner-service', {
      serviceName: 'topics-loadgen-browser-runner',
      cluster: cluster,
      taskDefinition: loadGenBrowserRunnerDefinition,
      assignPublicIp: true,
      desiredCount: 0,
      securityGroups: [topicsLoadGenSecurityGroup],
      cloudMapOptions: {
        name: browserRunnerServiceName,
        cloudMapNamespace: dnsNamespace,
        dnsRecordType: DnsRecordType.A,
      },
    });

    const loadGenWebServerDefinition = new ecs.FargateTaskDefinition(this, 'topics-loadgen-webserver-task-def', {
      memoryLimitMiB: 1024,
      taskRole: topicsLoadGenTaskRole,
      cpu: 512,
      runtimePlatform: {
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        cpuArchitecture: ecs.CpuArchitecture.X86_64,
      },
      family: 'topics-loadgen-webserver',
    });

    new ecs.ContainerDefinition(this, 'topics-loadgen-webserver-container-definition', {
      taskDefinition: loadGenWebServerDefinition,
      image: topicsLoadGenWebServerImage,
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'topics-loadgen-webserver',
      }),
    });

    const webServerServiceName = 'webserver';
    new ecs.FargateService(this, 'topics-loadgen-webserver-service', {
      serviceName: 'topics-loadgen-webserver',
      cluster: cluster,
      taskDefinition: loadGenWebServerDefinition,
      assignPublicIp: true,
      desiredCount: 0,
      securityGroups: [topicsLoadGenSecurityGroup],
      cloudMapOptions: {
        name: webServerServiceName,
        cloudMapNamespace: dnsNamespace,
        dnsRecordType: DnsRecordType.A,
      },
    });
  }
}
