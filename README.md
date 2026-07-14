# Addon Maldiciones

Addon basico para Minecraft Bedrock con tres maldiciones automaticas. Los pergaminos se mantienen solo para probarlas rapido.

Version actual: 1.0.20. Los archivos `.mcaddon` se exportan con version en el nombre y los packs muestran la version en Minecraft.

## Maldiciones

- Manos Resbaladizas: se consigue por jugar 30 minutos continuos. Es permanente hasta usar Limpia y cada cierto tiempo lanza fuera del inventario de 1 a 3 objetos, de 2 a 3 bloques frente al jugador.
- Hipo Ascendente: se consigue por nadar mas de 1 minuto en el agua. Es permanente hasta usar Limpia, reproduce un sonido de hipo y teletransporta al jugador de 1 a 3 bloques hacia arriba y de 0.4 a 1 bloque hacia atras de donde mira, sin mensajes de comando.
- Desvelo Sombrio: se consigue por pasar una noche sin dormir. Es permanente hasta usar Limpia y altera la vision con ciclos de oscuridad y ceguera.
- Limpia: item de un solo uso que quita todas las maldiciones activas. Se craftea con un huevo, 3 cristales y un cubo de agua en la mesa de trabajo. La receta tambien entrega una cubeta vacia.

## Como probarlo

1. Copia `Maldiciones_BP` a `com.mojang/development_behavior_packs`.
2. Copia `Maldiciones_RP` a `com.mojang/development_resource_packs`.
3. Activa ambos packs en un mundo con Cheats y Beta APIs/Script APIs si tu version lo solicita.
4. Craftea Limpia con esta forma:

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
/give @s mal:limpia
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
- `scripts/items/`: comportamiento de items como pergaminos y Limpia.
- `scripts/triggers/`: activadores automaticos por condiciones del jugador.
- `scripts/utils/`: funciones compartidas.
