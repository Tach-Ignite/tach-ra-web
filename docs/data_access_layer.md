# Data Access Layer

This RA provides abstraction of data providers. Switching providers is as easy as changing a configuration setting, without any change to the code. For more information on configuration the data provider, see [Tach Configuration](/docs/tach_configuration.md).

## Data Storage Example

The `DatabaseClientFactory` will provide a database client based on the configuration. The client provides standard CRUD operations.

```typescript
import { IDatabaseClient } from '@/lib/data';
import { IFactory } from '@/lib/abstractions';
import { ModuleResolver } from '@/lib/ioc';
import { IFileStorageService, IImageStorageService } from '@/lib/services';
import { DataProviderModule } from '@/lib/modules/services/server/data/dataProvider.module';
// Resolve the database client factory
const container = new ModuleResolver().resolve(DataProviderModule);
const databaseClientFactory = container.resolve<IFactory<Promise<IDatabaseClient>>>(
  'databaseClientFactory'
);
...
// Create the database client
const client = await databaseClientFactory.create();
// Select all products that match the friendlyId
const productsWithFriendlyId =
    await databaseClient.select<ProductDto>(
      { friendlyId: createProductApiRequest.friendlyId },
      'products'
    );
```

## File Storage Example

The `FileStorageService` provides features to manage file storage. File storage should be used for storage that is not appropriate for a database, for example word documents, pdfs, etc.

```typescript
import { ModuleResolver } from '@/lib/ioc';
import { IFileStorageService } from '@/lib/services';
import { FileStorageServiceModule } from '@/lib/modules/services/server/fileStorage/fileStorageService.module.ts';

// Resolve the file storage service factory
const m = new ModuleResolver().resolve(FileStorageServiceModule);
const fileStorageServiceFactory = m.resolve<
  IFactory<IFileStorageService>
>('fileStorageServiceFactory');
...
// Create the file storage service
const fileStorageService = await fileStorageServiceFactory.create();
// Delete a file by its unique storage key
await fileStorageService.deleteFile(storageKey);
```

### File Storage Caveat - URL File Access

An assumption made of the file storage provider is that you can retrieve your files via a url. This feature comes out of the box with S3 and other cloud storage providers. However, this may not be true of all providers, including the `mongodb` provider. In this RA, we've created an API endpoint to serve static files stored in mongodb or other providers. This can be used to implement your own restful endpoint for retrieving files.

For now, the url location for the `getSignedUrl` function of the `mongodb` provider is hardcoded to `api/static/[...key]`.

## Image Storage Example

The `ImageStorageService` provides features to upload and generate presigned URLs for images. This is a wrapper around the FileStorageService, providing some additional features to ensure images are well-formed.

```typescript
import { ModuleResolver } from '@/lib/ioc';
import { IImageStorageService } from '@/lib/services';
import { FileStorageServiceModule } from '@/lib/modules/services/server/fileStorage/fileStorageService.module';

// Resolve the image storage service. Note this service does not require a factory because it utilizes the file storage service factory.
const m = new ModuleResolver().resolve(FileStorageServiceModule);
const imageStorageService = m.resolve<IImageStorageService>(
  'imageStorageService',
);

// Extract an image from a form data request
const imageBlob = formData.get('image') as File | null;
if (!imageBlob) {
  return NextResponse.json(
    { error: 'No product image found.' },
    { status: 400 },
  );
}
// Set image metadata
const imageFileName = randomUUID().replaceAll('-', '');
const imageContentType = imageBlob.type;
// Convert to array buffer
const imageStream = await imageBlob.arrayBuffer();
// Upload image
const storageKey = await imageStorageService.uploadImage(
  imageFileName,
  imageStream as any,
  imageContentType,
);
```
