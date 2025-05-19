// // utils/cleanQuery.ts
// export const cleanScopusQuery = (dirtyQuery: string): string => {
//     // Paso 1: Elimina caracteres no deseados (`, \)
//     let cleaned = dirtyQuery
//       .replace(/`/g, '')               // Elimina `
//       .replace(/\\"/g, '"')            // Convierte \" en "
//       .replace(/\s*\\\s*/g, ' ')       // Elimina \ sueltos
//       .trim();
  
//     // Paso 2: Normaliza espacios alrededor de operadores y paréntesis
//     cleaned = cleaned
//       .replace(/\s*([()])\s*/g, '$1')  // Ej: "AND ( " -> "AND("
//       .replace(/\s{2,}/g, ' ');        // Múltiples espacios -> 1
  
//     return cleaned;
//   };

  // utils/cleanQuery.ts
export const cleanScopusQuery = (dirtyQuery: string): string => {
    // Elimina TODOS los caracteres no deseados y normaliza
    return dirtyQuery
      .replace(/`/g, '')               // Elimina `
      .replace(/\\(")/g, '$1')         // Convierte \" en " (¡sin tocar otras \!)
      .replace(/\s*\\\s*/g, ' ')       // Elimina \ sueltas con espacios alrededor
      .replace(/\s+/g, ' ')            // Normaliza espacios múltiples
      .replace(/(\()\s+/g, '$1')       // Elimina espacios después de (
      .replace(/\s+(\))/g, '$1')       // Elimina espacios antes de )
      .trim();
  };