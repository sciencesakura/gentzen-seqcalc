/**
 * Represents an error that indicates failed to parse sequent.
 */
class SequentParseError extends Error {
    /** Gets the 0-based position this error occurred. */
    readonly position?: number;

    /**
     * A constructor.
     *
     * @param message the description of this error
     * @param position the 0-based position this error occurred
     */
    constructor(message: string, position?: number) {
        super(position === undefined ? message : `${message} (${position})`);
        this.position = position;
        this.name = 'SequentParseError';
    }
}

export { SequentParseError };
