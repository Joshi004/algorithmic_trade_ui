export class SearchComponentHelper {
    
    static toTitleCase(snakeCaseStr) {
        return snakeCaseStr.split('_')  // Split the string into words at each underscore
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize the first letter of each word and make the rest of the word lowercase
          .join(' ');  // Join the words back together with spaces
      };
  
  
    }
  
