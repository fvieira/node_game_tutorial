class Color {
    constructor(private red: number, private green: number, private blue: number) {}

    public getAsRGB(): string {
        return "rgb(" + this.red + "," + this.green + "," + this.blue + ")"
    }
}
