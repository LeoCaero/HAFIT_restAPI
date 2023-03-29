const errorMessages = {
  notFound: "Lo siento, no se ha encontrado la página que estás buscando.",
  serverError: "Se ha producido un error en el servidor. Por favor, inténtalo de nuevo más tarde.",
  invalidRequest: "La solicitud que has enviado no es válida. Por favor, comprueba los datos e inténtalo de nuevo.",
  notFound: {
    user: {
      email: "NO user found with the specified email",
      name: "No user found with the specified name",
      _id: "NO user found with the specified id",
    },
    plan: {
      name: "No user found with the specified name",
      number: "NO user found with the specified number",
    },
    missing: "Missing search criteria.",
  },
};

module.exports = errorMessages;
