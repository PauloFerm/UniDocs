# Proyecto UniDocs para publicación de documentos técnicos

Planilla con formato para Presupuesto y Especificaciones Técnicas de obra, con funcionalidades para publicación según requerimientos.

## Funcionalidades implementadas

- [x] Crea carpeta `Entregables/` en la dirección del Archivo
- [ ] Genera archivo `EETT {nombre_proyecto}` en formato pdf.
- [ ] Genera archivo `EETT {nombre_proyecto} Editable` para entregar en excel sin vinculaciones, manteniendo el formato.
- [ ] Genera archivo de `Presupuesto {nombre_proyecto}` sin vinculación, comentarios y otros procedimientos de uso interno.
- [ ] Genera archivo `Itemizado {nombre_proyecto}`, similar a `Presupuesto` pero sin cubicaciones y precios unitarios, mantiene fórmulas de subtotales, porcentajes y costo total.
- [ ] Verifica la coherencia en la enumeración entre el Presupuesto y las EETT

## Forma de Uso

Para el correcto uso de la planilla es indispensable el uso de macros escriptas en [GoogleAppsScript](https://www.google.com/script/start/), las cuales se encuentran vinculadas con la planilla y se encuentran descritas en este repositorio.

### Copiar Archivo

Se debe crear una copia exacta del archivo mediante el menú `Archivo -> Hacer una copia`, ubicar la copia en la carpeta correspondiente al proyecto y es indispensable **no cambiar la extensión a Microsoft Excel**.

### Modificar Variables Requeridas
Todas las variables del documento que tengan el formato ${variable} deben ser reemplazadas por los datos correspondientes del proyecto. Estos son: `nombre_proyecto`, `ubicación`, `codigo_bip`, `superficie`. Otras variables pueden ser añadidos posteriormente.


### Otorgar Permisos al Script

Al momento de ejecutar el primer comando Google Drive solicita permisos para crear, modificar y eliminar archivos. Para el correcto funcionamiento de las funcionalidades de exportación se deben otorgar todos los permisos.


## Errores

En caso de errores se puede encontrar una descripción detallada en el [monitor de ejecuciones](https://script.google.com/home/executions) de Google.

## Desarrollo

Se utiliza la interfaz [clasp](https://developers.google.com/apps-script/guides/clasp) y el lenguaje [Typescript](https://www.typescriptlang.org/) en su [configuración recomendada](https://developers.google.com/apps-script/guides/typescript) para el desarrollo sobre GoogleAppsScript.
