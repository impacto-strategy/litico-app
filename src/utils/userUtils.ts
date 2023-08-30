// Helper function to make following conditionals easier.
export const hasValidProperties = (obj: any, propertyNames: any) => {
    return propertyNames.every((name: any) => obj.hasOwnProperty(name) && obj[name] !== null && obj[name] !== undefined);
}

export const checkUserHasData = (obj: any) => {
    if (hasValidProperties(obj, ['email', 'id', 'companies', 'name'])) {
        if (!obj.companies.length) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}