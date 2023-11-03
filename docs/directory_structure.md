# Directory Structure

The application code should be contained to the `src` directory. This directory is structured as follows:

src
\
├── abstractions - Any interfaces specific to your implementation, including repositories and services.
\
├── commands - All Command implementations live here.
\
├── components - Reusable Components
\
├── lib - Tach Library Files
\
├── mapping - contains key automapper classes that act as the composition root for automapper.
\
├── mappingProfiles - central location for all mappingProfiles. Directory structure should mirror application structure.
\
├── models - Application-Specific Models
\
├── modules - Modules used to manage and resolve dependencies for inversion of control (IOC).
\
├── pages - Routable Application Pages
\
└── repositories - contains all repository implementations.
\
└── rtk - RTK & RTK Query Implementation
\
└── services - services that contain all business logic for the application.
\
└── styles - contains any global styles you may need.

## Why Pages Router?

While the app router has a number of exciting new features, the community support for these capabilities is limited. Because we are utilizing a number of community packages as a part of this RA, we chose to stick with the Pages router for now.
