const getStatusColor = (status: string) => {
    switch (status) {
        case "HEALTHY":
            return "text-green-600 bg-green-50";
        case "LOW":
            return "text-yellow-600 bg-yellow-50";
        case "CRITICAL":
            return "text-red-600 bg-red-50";
        default:
            return "text-gray-600 bg-gray-50";
    }
};

export { getStatusColor };