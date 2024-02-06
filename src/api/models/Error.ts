/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Describes the error in greater detail.  This will typically be null in a production use case and should only be used for debugging purposes.
 */
export type Error = {
    /**
     * An id that can be used to locate this error for tracing and forensics.  The internal format of this identifier is undefined, please treat it as an opaque string.
     */
    id?: string;
    /**
     * A brief description of what went wrong to help with debugging.  May not appear in production releases, do not rely on the message.
     */
    message?: string;
    exception?: {
        /**
         * A brief description of what went wrong to help with debugging.  May not appear in production releases, do not rely on the message.
         */
        message?: string;
        /**
         * < This is the type of exception that was raised if known.
         */
        type?: string;
        /**
         * < This is the text that represents the frame information for this portion of the stack trace.  Note that this is language specific, and may contain any information that is relevant.
         */
        stack?: string;
    };
    /**
     * A list of validation issues that were found when processing the request.
     */
    field_errors?: Array<{
        /**
         * Location of the field:
         * * `query` - In the query string.  The field should be the name of the query parameter or path fragment.
         * * `body` - In the body of the request.  The field should be specified using a content type specific path (JSONPath for JSON, XMLPath for XML, etc.)
         *
         */
        location: 'body' | 'query';
        /**
         * The path (content type specific) or name of the field that was incorrect.
         */
        field: string;
        /**
         * The reason the field was incorrect.
         */
        reason: string;
    }>;
};

