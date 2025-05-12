#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AurorasWatchStack } from '../lib/auroras-watch-stack';

const app = new cdk.App();
new AurorasWatchStack(app, 'AurorasWatchStack', {});
