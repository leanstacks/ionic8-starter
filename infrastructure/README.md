# Ionic Starter Infrastructure

AWS CDK infrastructure for the Ionic Starter application.

## Quick Start

1. **Setup environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your AWS configuration
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Bootstrap CDK (first time only):**

   This step should only be performed 1 time per AWS Account. An Account needs only to be bootstrapped for the AWS CDK once.

   ```bash
   npx cdk bootstrap
   ```

4. **Build main application:**

   ```bash
   cd ..
   npm run build
   cd infrastructure
   ```

5. **Deploy:**
   ```bash
   npm run deploy:all
   ```

## Scripts

- `npm run build` - Build TypeScript
- `npm run deploy` - Deploy infrastructure
- `npm run destroy` - Destroy infrastructure
- `npm run diff` - Preview changes
- `npm run synth` - Synthesize CloudFormation
- `npm run test` - Run infrastructure unit tests
- `npm run test:coverage` - Run infrastructure unit tests with coverage

## Further Reading

See the [Infrastructure Guide](../docs/INFRASTRUCTURE_GUIDE.md) for complete documentation.
