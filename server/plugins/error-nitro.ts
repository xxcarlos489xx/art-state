import * as yup from 'yup'

export default defineNitroPlugin((nitroApp) => {    
    nitroApp.hooks.hook("error", async (error, { event }) => {
        // setResponseHeader(event, 'Content-Type', 'application/json')
        // setResponseStatus(event, error.statusCode, error.statusMessage)
        
        // console.log(`XXXX ${event?._path} Application error:`, error)

        // Intercepta errores y formatea la respuesta
        if (event && event?.node?.req?.url?.startsWith("/api")) {
            setResponseHeader(event, "Content-Type", "application/json");
            // new Error or H3Error(createError)            
            const validationError = 
                error instanceof yup.ValidationError
                ? error
                : error.cause instanceof yup.ValidationError
                ? error.cause
                : null

            if (validationError) {
                setResponseStatus(event, 400, 'Bad Request')
                return send(
                    event,
                    JSON.stringify({
                        statusCode: 400,
                        message: 'Errores de validación',
                        errors: validationError.errors,
                    })
                )
            }

            const isCommonError = error.cause instanceof Error;
            const errorObj = isCommonError
              ? {
                  statusCode: event.node.res.statusCode,
                  message: error.message,
                }
              : error.cause;
            return send(event, JSON.stringify(errorObj));
        }
    });

    nitroApp.hooks.hook("beforeResponse", (event, { body }) => {
        // console.log("on response", event.path, { body });
    });
});