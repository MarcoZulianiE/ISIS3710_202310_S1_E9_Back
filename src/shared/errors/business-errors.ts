/* eslint-disable prettier/prettier */
export function BusinessLogicException(message: string, type: number) {
    this.message = message;
    this.type = type;
}

export enum BusinessError {
    NOT_FOUND,
    PRECONDITION_FAILED,
    BAD_REQUEST
}

export function NotFoundErrorMessage(entity: string) {
    return `The ${entity} with the given id was not found.`;
}

export function PreconditionFailedErrorMessage(ownerEntity: string, entity: string) {
    return `The ${entity} with the given id is not associated to the ${ownerEntity}.`;
}