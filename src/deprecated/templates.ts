export const allXList = `
<%prefix%>:all<%name.plural.upper%>List(<%variables.model%>){
  ...body<%namespace%>
}`;

export const allX = `
<%prefix%>:all<%name.plural.upper%>(<%variables.model%>){
      pageInfo {
        hasPreviousPage
        hasNextPage
    }
    totalCount
    docs: nodes {
      ...body<%namespace%>
    }
}`;
export const xBy = `
<%prefix%>:<%name.singular.lower%>By<%custom.by%>(<%variables.model%>){
  ...body<%namespace%>
}`;

export const createX = `
<%prefix%>:create<%name.singular.upper%>(input:{<%variables.model%>}){
  doc:<%name.singular.lower%>{
    ...body<%namespace%>
  } 
}`;

export const updateX = `
<%prefix%>:update<%name.singular.upper%>By<%custom.by%>(input:{<%variables.model%>}){
  doc:<%name.singular.lower%>{
    ...body<%namespace%>
  } 
}`;

export const deleteX = `
<%prefix%>:delete<%name.singular.upper%>By<%custom.by%>(input:{<%variables.model%>}){
  doc:<%name.singular.lower%>{
    ...body<%namespace%>
  } 
}`;

export const query = `
query(<%variables.query%>) {
   <%custom.body%>
}
<%custom.fragments%>
`;

export const mutation = `
mutation(<%variables.query%>) {
   <%custom.body%>
}
`;
