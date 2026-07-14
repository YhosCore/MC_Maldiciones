# Addon Maldiciones

Addon basico para Minecraft Bedrock con tres maldiciones automaticas. Los pergaminos se mantienen solo para probarlas rapido.

Version actual: 1.0.11. Los archivos `.mcaddon` se exportan con version en el nombre y los packs muestran la version en Minecraft.

## Maldiciones

- Manos Resbaladizas: se consigue por jugar 30 minutos continuos. Dura 10 minutos y cada cierto tiempo lanza fuera del inventario de 1 a 3 objetos, de 2 a 3 bloques frente al jugador.
- Hipo Ascendente: se consigue por nadar mas de 1 minuto en el agua. Dura 1 minuto y teletransporta al jugador de 2 a 6 bloques hacia arriba en intervalos aleatorios.
- Desvelo Sombrio: se consigue por pasar una noche sin dormir. Dura 4 minutos y altera la vision con ciclos de oscuridad y ceguera.
- Limpia Huevo: item de un solo uso que limpia todas las maldiciones activas al usarse. Se craftea con un huevo, 3 cristales y un cubo de agua en la mesa de trabajo.

## Como probarlo

1. Copia `Maldiciones_BP` a `com.mojang/development_behavior_packs`.
2. Copia `Maldiciones_RP` a `com.mojang/development_resource_packs`.
3. Activa ambos packs en un mundo con Cheats y Beta APIs/Script APIs si tu version lo solicita.
4. Craftea Limpia Huevo con esta forma:

```text
[ Vacío   ] [ Huevo        ] [ Vacío   ]
[ Cristal ] [ Cubo de agua ] [ Cristal ]
[ Vacío   ] [ Cristal      ] [ Vacío   ]
```

5. Para probar sin esperar los requisitos automaticos, en creativo busca los pergaminos o usa comandos `/give`:

```mcfunction
/give @s mal:pergamino_vertigo_errante
/give @s mal:pergamino_hipo_ascendente
/give @s mal:pergamino_desvelo_sombrio
/give @s mal:limpia_huevo
```

## Abrir en VS Code

Abre esta carpeta:

```text
C:\Users\manue\Escritorio\Minecraft_Proyectos\Addon_Maldiciones
```

## Organizacion del codigo

El script esta separado por responsabilidades:

- `scripts/main.js`: punto de entrada del addon.
- `scripts/curses/`: una maldicion por archivo.
- `scripts/core/`: registro, ejecucion y limpieza de maldiciones.
- `scripts/items/`: comportamiento de items como pergaminos y Limpia Huevo.
- `scripts/triggers/`: activadores automaticos por condiciones del jugador.
- `scripts/utils/`: funciones compartidas.
