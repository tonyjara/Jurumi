# Notes on PDF implementation

As you can see, inside the FormControlledImage upload, there is a reference to a file located in the public folder.
This is because, for some reason, that file was not being detected. Therefore, in order to make the PDF conversion work, it has to be in place.
