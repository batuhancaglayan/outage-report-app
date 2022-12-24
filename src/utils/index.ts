export const breathSpace = async delayInS => new Promise<void>(res => setTimeout(() => res(), delayInS * 1000));

export const arrayToMap = (data: { [key: string]: any}[], key: string) => {
    return (data || []).reduce(function(map, obj) {
        map[obj[key]] = obj;
        return map;
    }, {});
};