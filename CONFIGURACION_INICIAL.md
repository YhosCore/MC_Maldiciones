# Configuracion inicial del proyecto

Este documento concentra las reglas y configuraciones solicitadas para iniciar y mantener el addon de Minecraft Bedrock.

## Herramientas de trabajo

- Editor principal: Visual Studio Code.
- Extension instalada: Blockception's Minecraft Bedrock Development.
- Extension instalada: Minecraft Bedrock Edition Debugger.
- Carpeta base original de trabajo: `C:\Users\manue\Escritorio\Minecraft_Proyectos\Addon_Maldiciones`.
- Repositorio Git vinculado: `https://github.com/YhosCore/MC_Maldiciones`.
- Rama de trabajo de Codex: `codex/manos-resbaladizas-rosario`.

## Estructura del addon

El proyecto debe conservar dos paquetes principales:

```text
Maldiciones_BP/
  manifest.json
  items/
  scripts/

Maldiciones_RP/
  manifest.json
  texts/
  textures/
    item_texture.json
    items/
```

El archivo importable final debe generarse como `.mcaddon`.

## Regla de versionado

Cada cambio futuro debe subir la version del addon.

La version debe aparecer en tres lugares:

- Nombre del archivo `.mcaddon`, por ejemplo: `Addon_Maldiciones_v1.0.3.mcaddon`.
- `header.version` de `Maldiciones_BP/manifest.json` y `Maldiciones_RP/manifest.json`.
- Texto visible en Minecraft dentro de `header.name` y `header.description`.

Ejemplo:

```json
{
  "name": "Maldiciones RP v1.0.3",
  "description": "Version 1.0.3 - Paquete de recursos para el addon de maldiciones.",
  "version": [1, 0, 3]
}
```

## Reglas de nombres e identificadores

- Namespace del addon: `mal`.
- Los identificadores deben usar formato `mal:nombre_tecnico`.
- Los pergaminos se mantienen solo como herramientas de prueba.
- Las maldiciones reales deben activarse por condiciones del jugador.

## Maldiciones iniciales

### Manos Resbaladizas

- Activacion automatica: jugar 30 minutos continuos.
- Duracion: 10 minutos.
- Efecto: cada cierto tiempo lanza fuera del inventario de 1 a 3 objetos.
- No debe aplicar mareo ni efectos visuales.
- Pergamino de prueba: `mal:pergamino_vertigo_errante`.

### Hipo Ascendente

- Activacion automatica: nadar mas de 1 minuto en agua.
- Duracion: 1 minuto.
- Efecto: teletransporta al jugador de 2 a 6 bloques hacia arriba en intervalos aleatorios.
- No debe mostrar mensajes en chat ni actionbar al activarse o ejecutarse.
- Pergamino de prueba: `mal:pergamino_hipo_ascendente`.

### Desvelo Sombrio

- Activacion automatica: pasar una noche sin dormir.
- Duracion: 4 minutos.
- Efecto: altera la vision con oscuridad y ceguera intermitente.
- Pergamino de prueba: `mal:pergamino_desvelo_sombrio`.

## Item de limpieza

### Rosario

- Identificador: `mal:rosario`.
- Inspiracion: cultura mexicana.
- Funcion: limpia todas las maldiciones activas del jugador.
- Debe estar registrado como item en BP y con textura en RP.

## Comandos de prueba

```mcfunction
/give @s mal:pergamino_vertigo_errante
/give @s mal:pergamino_hipo_ascendente
/give @s mal:pergamino_desvelo_sombrio
/give @s mal:rosario
```

## Flujo Git

Para cambios futuros:

1. Trabajar en una rama separada.
2. Validar JSON antes de hacer commit.
3. Validar sintaxis del script principal con Node.
4. Generar un nuevo `.mcaddon` con version en el nombre.
5. Hacer commit.
6. Subir la rama al repositorio remoto.

Comandos de validacion:

```powershell
Get-ChildItem -Path . -Recurse -Filter *.json | ForEach-Object {
  Get-Content -Raw -LiteralPath $_.FullName | ConvertFrom-Json | Out-Null
}

node --check Maldiciones_BP\scripts\main.js
```
