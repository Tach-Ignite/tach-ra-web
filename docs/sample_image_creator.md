# Sample Image Creator

Sample Image Creator is a TypeScript script that generates SVG images with random colors and saves them to the file system. the script is located at `tach_extra/image_creator/imageCreator.ts` 


1. Open a terminal window and navigate to the `tach_extra/image_creator` directory of the repository.
1. Run the following command to generate sample images. Replace `[numCopies]`  with the number of copies you want to generate. If you omit this argument, the script generates 5 copies by default.

    ``` bash
    npx tsx imageCreator.ts [numCopies]
    ```
1. The script generates the SVG images with random colors and saves them to the `local_data` folder in the location that you run the script from.
