
The user wants the right edge to NOT be flush — they want margin/padding on the right side. Currently the Quick Links column has `-mr-6 md:-mr-12` which pulls it flush. Remove that negative margin so the column respects the footer's `px-6 md:px-12` padding and has breathing room from the right edge.
