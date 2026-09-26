# Stencils

Cada diseño de las hojas de flash (`originales/`) separado en su propio PNG con fondo transparente.
El sombreado se conserva como transparencia parcial, así que se ven bien sobre cualquier fondo.

Para regenerarlos:

```sh
pip install pillow numpy scipy
python3 tools/separar_stencils.py originales/hoja_2.jpg salida/ hoja2
```

## Stickers

Versión con borde blanco y sombra suave en `stickers/`:

```sh
python3 tools/hacer_stickers.py stencils stickers
```
