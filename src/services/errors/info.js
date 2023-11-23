export const generateUserErrorInfo = (user) => {
  return `One or more properties were incomplete or invalid.
    List of requied properties:
    *first_name : needs to be a String, received ${user.first_name}
    *last_name : needs to be a String, received ${user.last_name}
    *email : needs to be a String, received ${user.email}`;
};

//Fix needed
export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or invalid.
      List of requied properties:
      *first_name : needs to be a String, received ${product.first_name}
      *last_name : needs to be a String, received ${product.last_name}
      *email : needs to be a String, received ${product.email}`;
  };