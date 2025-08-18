const allowedOrigins = ['http://localhost:5173']; // Fixed variable name

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list or matches www variant
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (origin === allowedOrigin) return true;
            
            // Handle www subdomain variants for https origins
            if (allowedOrigin.startsWith('https://')) {
                const withWww = allowedOrigin.replace('https://', 'https://www.');
                const withoutWww = allowedOrigin.replace('https://www.', 'https://');
                return origin === withWww || origin === withoutWww;
            }
            
            return false;
        });
        
        // Proper error handling: pass false as second parameter on error
        callback(isAllowed ? null : new Error("Origin not allowed"), isAllowed);
    },
    credentials: true,
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

export default corsOptions;