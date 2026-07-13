# Addon Maldiciones

Addon basico para Minecraft Bedrock con tres maldiciones automaticas. Los pergaminos se mantienen solo para probarlas rapido.

Version actual: 1.0.2. Los archivos `.mcaddon` se exportan con version en el nombre para evitar confusiones al importar cambios en Minecraft.

## Maldiciones

- Manos Resbaladizas: se consigue por jugar 30 minutos continuos. Dura 10 minutos y cada cierto tiempo lanza fuera del inventario de 1 a 3 objetos.
- Hipo Ascendente: se consigue por nadar mas de 1 minuto en el agua. Dura 1 minuto y teletransporta al jugador de 2 a 6 bloques hacia arriba en intervalos aleatorios.
- Desvelo Sombrio: se consigue por pasar una noche sin dormir. Dura 4 minutos y altera la vision con ciclos de oscuridad y ceguera.
- Rosario: item inspirado en la cultura mexicana que limpia todas las maldiciones activas al usarse.

## Como probarlo

1. Copia `Maldiciones_BP` a `com.mojang/development_behavior_packs`.
2. Copia `Maldiciones_RP` a `com.mojang/development_resource_packs`.
3. Activa ambos packs en un mundo con Cheats y Beta APIs/Script APIs si tu version lo solicita.
4. Para probar sin esperar los requisitos automaticos, en creativo busca los pergaminos o usa comandos `/give`:

```mcfunction
/give @s mal:pergamino_vertigo_errante
/give @s mal:pergamino_hipo_ascendente
/give @s mal:pergamino_desvelo_sombrio
/give @s mal:rosario
```

## Abrir en VS Code

Abre esta carpeta:

```text
C:\Users\manue\Escritorio\Minecraft_Proyectos\Addon_Maldiciones
```
