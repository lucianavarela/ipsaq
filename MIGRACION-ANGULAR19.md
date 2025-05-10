# Migración de Angular 17 a Angular 19

Este documento describe el proceso de migración de la aplicación desde Angular 17 a Angular 19, incluyendo los cambios arquitectónicos realizados y los requisitos para ejecutar la aplicación actualizada.

## Requisitos de instalación

Para ejecutar este proyecto migrado a Angular 19 en una nueva computadora, necesitarás:

### Requisitos de software

1. **Node.js**: Versión 20.11.0 o superior
   ```bash
   node -v
   ```
   Si necesitas actualizar: [Descargar Node.js](https://nodejs.org/)

2. **npm**: Versión 10.2.4 o superior
   ```bash
   npm -v
   ```
   (Se actualiza con Node.js)

3. **Angular CLI**: Versión 19.0.0
   ```bash
   npm install -g @angular/cli@19
   ```

4. **TypeScript**: Versión 5.5.2
   ```bash
   npm install -g typescript@5.5.2
   ```

### Configuración del proyecto

1. **Actualizar @ng-select/ng-select** (necesario para compatibilidad con Angular 19):
   ```bash
   cd ipsaq
   npm uninstall @ng-select/ng-select && npm install @ng-select/ng-select@latest --save
   ```

2. **Instalar tipos de Node.js** (necesario para TypeScript en Angular 19):
   ```bash
   npm install @types/node@20.12.5 --save-dev
   ```

3. **Instalar dependencias del proyecto**:
   ```bash
   npm install
   ```

4. **Ejecutar el servidor de desarrollo**:
   ```bash
   ng serve
   ```

5. **Acceder a la aplicación**:
   Abre tu navegador en `http://localhost:4200/`

## Cambios realizados en la migración

### 1. Actualización de dependencias

- Actualizados todos los paquetes de Angular a la versión 19.0.0
- Actualizado TypeScript de 5.4.2 a 5.5.2
- Actualizado zone.js de ~0.14.4 a ~0.15.0
- Actualizado @ng-select/ng-select a la versión compatible con Angular 19

[Guía oficial de actualización a Angular 19](https://angular.dev/guide/update-to-latest-version)

### 2. Arquitectura de componentes standalone

El cambio más importante es que todos los componentes ahora son standalone. Esto significa:

- Ya no se usa `app.module.ts` para declarar componentes
- Cada componente importa directamente sus dependencias
- Los componentes se declaran con `standalone: true` y un array `imports`

[Documentación oficial sobre componentes standalone](https://angular.dev/guide/standalone-components)

**Antes (Angular 17):**
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent { }

// En app.module.ts
@NgModule({
  declarations: [ExampleComponent],
  imports: [CommonModule],
  // ...
})
export class AppModule { }
```

**Ahora (Angular 19):**
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  standalone: true,
  imports: [CommonModule, OtrosComponentes]
})
export class ExampleComponent { }
```

### 3. Bootstrapping de la aplicación

[Documentación oficial sobre bootstrapApplication](https://angular.dev/api/platform-browser/bootstrapApplication)

**Antes (Angular 17):**
```typescript
// main.ts
platformBrowserDynamic().bootstrapModule(AppModule)
```

**Ahora (Angular 19):**
```typescript
// main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(),
    // otros providers...
  ]
})
```

### 4. Routing

[Documentación oficial sobre provideRouter](https://angular.dev/api/router/provideRouter)

**Antes (Angular 17):**
```typescript
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

**Ahora (Angular 19):**
```typescript
// app-routing.module.ts (ahora solo exporta rutas)
export const appRoutes: Routes = [
  // definición de rutas
];

// main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    // ...
  ]
})
```

### 5. Resolvers y Guards

[Documentación oficial sobre guards funcionales](https://angular.dev/api/router/CanActivateFn)
[Documentación oficial sobre resolvers funcionales](https://angular.dev/api/router/ResolveFn)

**Antes (Angular 17):**
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate() { /* ... */ }
}
```

**Ahora (Angular 19):**
```typescript
@Injectable()
export class AuthGuardService {
  canActivate() { /* ... */ }
}

export const AuthGuard: CanActivateFn = () => {
  return inject(AuthGuardService).canActivate();
};
```

### 6. Importación de módulos en componentes

[Documentación oficial sobre importación en componentes standalone](https://angular.dev/guide/standalone-components#importing-standalone-components)

Ahora cada componente debe importar explícitamente todos los módulos que utiliza:

- `CommonModule` para directivas como `*ngIf` y `*ngFor`
- `RouterLink` para enlaces de navegación
- `FormsModule` para `ngModel`
- Módulos de Angular Material específicos
- Otros componentes standalone que se utilizan en la plantilla

### 7. Pipes y Directivas

[Documentación oficial sobre pipes y directivas standalone](https://angular.dev/guide/standalone-components#standalone-directives-and-pipes)

Todos los pipes y directivas también son standalone y deben ser importados en cada componente que los utiliza.

### 8. Configuración de TypeScript y tipos de Node.js

[Documentación oficial sobre configuración de TypeScript para Angular](https://angular.dev/guide/typescript-configuration)

Se actualizó el archivo `tsconfig.json` para incluir explícitamente los tipos de Node.js, necesarios para Angular 19:

**Antes (Angular 17):**
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    // otras opciones...
  }
}
```

**Ahora (Angular 19):**
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    // otras opciones...
    "types": [
      "node",
      "jasmine"
    ]
  }
}
```

Este cambio resuelve el error común:
```
Cannot find type definition file for 'node'.
The file is in the program because:
Entry point for implicit type library 'node'
```

También fue necesario actualizar la versión de `@types/node` para que sea compatible con Angular 19, como se indica en la sección de configuración del proyecto.

### 9. Resolución de conflictos de dependencias

[Documentación oficial sobre resolución de dependencias](https://angular.dev/guide/npm-packages)

Durante la migración se encontró un conflicto entre Angular 19 y la versión de `@ng-select/ng-select`. Este componente requería Angular 17 pero estábamos usando Angular 19. La solución fue actualizar `@ng-select/ng-select` a la última versión como se indica en la sección de requisitos de instalación.

## Consideraciones para mantenimiento

### Al crear nuevos componentes

[Documentación oficial sobre creación de componentes standalone](https://angular.dev/guide/standalone-components#creating-a-standalone-component)

1. Marcarlos como `standalone: true`
2. Importar todos los componentes/directivas/pipes que uses
3. No olvidar CommonModule si usas directivas estructurales

```typescript
@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    // otros componentes y módulos necesarios
  ]
})
export class NuevoComponent { }
```

### Al usar componentes en plantillas

[Documentación oficial sobre uso de componentes en plantillas](https://angular.dev/guide/standalone-components#using-standalone-components)

Asegúrate de importarlos en el array `imports` del componente:

```typescript
@Component({
  // ...
  imports: [
    CommonModule,
    MiComponentePersonalizado
  ]
})
```

### Para nuevas rutas

[Documentación oficial sobre rutas con componentes standalone](https://angular.dev/guide/router#configuring-routes-with-standalone-components)

Agrégalas directamente a `appRoutes` en app-routing.module.ts:

```typescript
export const appRoutes: Routes = [
  // rutas existentes...
  { 
    path: 'nueva-ruta', 
    component: NuevoComponent,
    resolve: {
      datos: miResolver
    }
  }
];
```

### Para nuevos servicios

[Documentación oficial sobre servicios en Angular](https://angular.dev/guide/dependency-injection)

Sigue usando `@Injectable({ providedIn: 'root' })` como antes:

```typescript
@Injectable({
  providedIn: 'root'
})
export class NuevoServicio { }
```

## Beneficios de la migración

1. **Mejor rendimiento**: Los componentes standalone permiten tree-shaking más eficiente
2. **Código más mantenible**: Cada componente declara explícitamente sus dependencias
3. **Actualizaciones más sencillas**: La arquitectura modular facilita actualizaciones futuras
4. **Mejor compatibilidad**: Acceso a las últimas características de Angular y mejoras de seguridad

## Componentes migrados a standalone

Todos los componentes de la aplicación fueron convertidos a standalone, incluyendo:

- AppComponent
- ToasterComponent, ToastComponent
- HomeComponent
- LoginComponent, ResetPwComponent
- LocationComponent
- SermonsComponent, SermonDetailComponent, SermonEditComponent
- SeriesComponent, SerieDetailComponent
- SongDetailComponent, SongEditComponent, SongSuggestionComponent
- ScheduleComponent
- SermonBoxComponent, SongsBoxComponent
- PageButtonComponent
- LyricsDialogComponent
- CommentBoxComponent
- AniversaryComponent
- DownloadsComponent
- PlanningComponent
- HistoryComponent
- BeliefsComponent
- GovernmentComponent
- LiveSermonComponent

Además, todos los pipes y directivas también fueron convertidos a standalone:

- SafeUrlPipe
- TransformYoutubePipe
- NoAccentsPipe
- TextFoundPipe
- HighlightDirective

## Nuevas características y mejoras en Angular 19

Angular 19 introduce varias mejoras y características nuevas que pueden ser aprovechadas en el desarrollo futuro:

### Control de flujo integrado

Angular 19 mejora el control de flujo en las plantillas con sintaxis más simple:

```html
<!-- Antes (Angular 17) -->
<div *ngIf="user">{{ user.name }}</div>

<!-- Ahora (Angular 19) -->
@if (user) {
  <div>{{ user.name }}</div>
}
```

[Documentación oficial sobre control de flujo](https://angular.dev/guide/templates/control-flow)

### Señales (Signals)

Las señales son un sistema de reactividad que proporciona cambio de detección granular y mejor rendimiento:

```typescript
// Definir una señal
const count = signal(0);

// Leer el valor
console.log(count()); // 0

// Actualizar el valor
count.set(1);
count.update(value => value + 1);

// Crear señales computadas
const doubleCount = computed(() => count() * 2);
```

[Documentación oficial sobre Signals](https://angular.dev/guide/signals)

### Inyección de dependencias mejorada

La función `inject()` permite una forma más flexible de inyectar dependencias:

```typescript
// Antes
constructor(private service: MyService) {}

// Ahora
private service = inject(MyService);
```

[Documentación oficial sobre inyección de dependencias](https://angular.dev/guide/di)

## Solución de problemas comunes

### Errores de importación

Si aparecen errores como "X is not a known element" o "Can't bind to Y since it isn't a known property", asegúrate de:

1. Importar el componente/directiva/pipe en el array `imports` del componente
2. Verificar que el componente importado sea standalone
3. Importar CommonModule para directivas como ngIf, ngFor, etc.
4. Importar FormsModule para ngModel

### Errores de compilación TypeScript

Si aparecen errores relacionados con TypeScript:

1. Verifica que la versión de TypeScript sea 5.5.2
2. Asegúrate de que tsconfig.json tenga la configuración correcta
3. Ejecuta `npm install` para reinstalar las dependencias

### Errores de dependencias

Si hay conflictos entre versiones de paquetes:

1. Revisa el archivo package.json para asegurar que todas las dependencias sean compatibles
2. Actualiza los paquetes problemáticos a versiones compatibles con Angular 19
3. Usa `npm ls @angular/core` para verificar si hay múltiples versiones instaladas

## Recursos útiles

- [Documentación oficial de Angular 19](https://angular.dev/)
- [Guía de actualización de Angular](https://angular.dev/guide/update-to-latest-version)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Guía de componentes standalone](https://angular.dev/guide/standalone-components)
- [Guía de migración a componentes standalone](https://angular.dev/guide/standalone-migration)
- [Repositorio GitHub de Angular](https://github.com/angular/angular)

## Comandos útiles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
ng serve

# Iniciar con configuración específica
ng serve --configuration=production

# Iniciar con puerto específico
ng serve --port 4201
```

### Construcción

```bash
# Construir para producción
ng build --configuration=production

# Construir con stats
ng build --stats-json
```

### Generación de código

```bash
# Generar un nuevo componente standalone
ng generate component mi-componente --standalone

# Generar un servicio
ng generate service mi-servicio

# Generar un pipe standalone
ng generate pipe mi-pipe --standalone
```

### Actualización

```bash
# Verificar actualizaciones disponibles
ng update

# Actualizar Angular CLI
ng update @angular/cli

# Actualizar Angular core y dependencias relacionadas
ng update @angular/core
``` 