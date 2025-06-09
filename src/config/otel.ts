/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/observability/otel.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
    detectResources,
    envDetector,
    hostDetector,
    osDetector,
    processDetector,
    resourceFromAttributes,
    defaultResource,
} from '@opentelemetry/resources';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});

const prometheusExporter = new PrometheusExporter(
    {
        port: 9464,
        endpoint: '/metrics',
    },
    () => {
        console.log(
            '✅ Prometheus exporter läuft auf http://localhost:9464/metrics',
        );
    },
);

let sdk: NodeSDK; // <<< global deklariert

export async function startOtelSDK() {
    const detected = await detectResources({
        detectors: [envDetector, hostDetector, osDetector, processDetector],
    });

    const resource = defaultResource()
        .merge(detected)
        .merge(
            resourceFromAttributes({
                'service.name': 'user-service',
            }),
        );

    sdk = new NodeSDK({
        traceExporter,
        metricReader: prometheusExporter,
        resource,
        instrumentations: [getNodeAutoInstrumentations()],
    });

    await sdk.start();
    console.log('✅ OpenTelemetry gestartet – mit service.name = user-service');
}

export async function shutdownOtelSDK() {
    if (sdk) {
        await sdk.shutdown();
        console.log('🛑 OpenTelemetry SDK gestoppt');
    } else {
        console.warn('⚠️ OpenTelemetry SDK war nicht initialisiert');
    }
}
