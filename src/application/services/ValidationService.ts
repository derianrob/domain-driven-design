import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export class ValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(errors.join(", "));
    this.name = "ValidationError";
  }
}

export class ValidationService {
  static async validate<T extends object>(
    dto: T,
    DtoClass: new () => T
  ): Promise<T> {
    // Convertir plain object a clase usando el método no deprecado
    const dtoInstance = plainToInstance(DtoClass, dto, {
      enableImplicitConversion: true, // Convierte tipos implícitamente
      excludeExtraneousValues: true, // Excluye propiedades que no están en el DTO
    });

    // Validar
    const errors = await validate(dtoInstance, {
      whitelist: true, // Solo permite propiedades decoradas
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
    });

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();

      throw new ValidationError(errorMessages);
    }

    return dtoInstance;
  }
}
