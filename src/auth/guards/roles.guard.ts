import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../../shared/security/roles";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
  
  // canActivate(context: ExecutionContext): boolean {
  //   const requireRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);

  //   if (!requireRoles) {
  //     return true;
  //   }
  //   const {user}=context.switchToHttp().getRequest();
    // const user: User = {
    //   name: "Nishant",
    //   roles: [Role.USER],
  //   // };
  //   return requireRoles.some((role) => user.roles.includes(role));
  // }
  
}

