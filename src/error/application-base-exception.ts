export default class ApplicationBaseException extends Error {
    public name: string;

    public constructor( message: string, name?: string) {
        super(message);

        this.name = name;
    }
}