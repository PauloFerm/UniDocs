# Proyecto UniDocs para publicación de documentos técnicos

Planilla con formato para Presupuesto y Especificaciones Técnicas de obra, con funcionalidades para publicación según requerimientos.

## Funcionalidades implementadas

### Documentos Exportables
- [x] Crea carpeta `Entregables/` en la dirección del Archivo
- [x] Genera archivo `EETT {nombre_proyecto} Editable` para entregar en excel sin vinculaciones, manteniendo el formato.
- [x] Genera archivo de `Presupuesto {nombre_proyecto}` sin vinculación, comentarios y otros procedimientos de uso interno.
- [x] Genera archivo `Itemizado {nombre_proyecto}`, similar a `Presupuesto` pero sin cubicaciones y precios unitarios, mantiene fórmulas de subtotales, porcentajes y costo total.
- [ ] Genera archivo `EETT {nombre_proyecto}` en formato pdf.
- [ ] Elimina versiones desactualizadas de los documentos exportados

### Verificación de documento
- [x] Verifica la coherencia en la enumeración entre el Presupuesto y las EETT.
- [ ] Alerta posibles fallos en la numeración.
- [ ] Gestión de partidas no utilizadas (EETT: #REF!)
  - [ ] Destacar partidas en desuso
  - [ ] Eliminar partidas en desuso
  - [ ] Reenumerar partidas

### Utilidades
- [x] Gestiona multiples proyectos con el módulo `deploy/`
- [ ] Clonar base de datos para nuevo proyecto
- [ ] Actualizar base de datos en proyectos existentes
  - :warning: Evitar sobreescribir descripciones de proyectos individuales

## Forma de Uso

Para el correcto uso de la planilla es indispensable el uso de macros escriptas en [GoogleAppsScript](https://www.google.com/script/start/), las cuales se encuentran vinculadas con la planilla y se encuentran descritas en este repositorio.

### Copiar Archivo

Se debe crear una copia exacta de la [planilla integrada](https://docs.google.com/spreadsheets/d/1Qsmix9wGY30_qMWt_O0wvGSQbemwdY4u7pqq1umwZEQ/) mediante el menú `Archivo -> Hacer una copia`, ubicar la copia en la carpeta correspondiente al proyecto y es indispensable **no cambiar la extensión a Microsoft Excel (.xlsx)**.

### Modificar Variables Requeridas
Todas las variables del documento que tengan el formato `${variable}` deben ser reemplazadas por los datos correspondientes del proyecto. Estos son: `nombre_proyecto`, `ubicación`, `codigo_bip`, `superficie`. Otras variables pueden ser añadidos posteriormente.

### Otorgar Permisos al Script
Al momento de ejecutar el primer comando Google Drive solicita permisos para crear, modificar y eliminar archivos. Para el correcto funcionamiento de las funcionalidades de exportación se deben otorgar todos los permisos.


# Desarrollo

Este proyecto utiliza la interfaz otorgada por google [clasp](https://developers.google.com/apps-script/guides/clasp), y está implementada en el lenguaje de programación [Typescript](https://www.typescriptlang.org/), utilizando la [configuración recomendada](https://developers.google.com/apps-script/guides/typescript) para el desarrollo de aplicaciones en GoogleAppsScript.

## Autenticación
Es necesario instalar y autenticar una cuenta de Google para poder desarrollar cambios en el script

```bash
npm install @google/clasp -g
Set-Execution-Policy Unrestricted   # For Windows
clasp login
```

## Configuración de Repositorio
Instalación manual de dependencias

```bash
npm i -D typescript ts-node
npm i -S @types/google-apps-script @inquirer/prompts
```

o solo instalar las dependencias listadas en `package.json`

```bash
npm install
```

## Estructura de carpetas
Los archivos del proyecto deben estar configuradas ( :warning: pendiente la implementación de `setup` script )

```
/
  deploy/
    ...ts
  gs/
    ...js
    .clasp.json
  src/
    ...ts
    appsscript.json
  .clasp.json
  package.json
  tsconfig.json
```

## Funcionamiento de `deploy/`
Para gestionar distintos proyectos similares, se puede utilizar el menú por terminal del módulo `deploy/`. Se requiere configurada la estructura de carpetas.

```bash
npm run menu
# or
ts-node deploy/menu.ts
```

## Manejo de Errores
En caso de errores se puede encontrar una descripción detallada en el [monitor de ejecuciones](https://script.google.com/home/executions) de Google.