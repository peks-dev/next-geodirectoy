# 6.1 Estructura del Formulario   
 --- 
**Subtasks:**   
- [ ] Preparar los archivos y estructura de carpetas   
- [ ] Componente wrapper principal   
- [ ] Indicador de progreso (Step 1/7)   
- [ ] Componente para controlar la navegación   
## Notas   
### Descripción   
**Propósito**: Permitir a usuarios autenticados agregar o actualizar información de canchas.   
- **Pasos o flujo del formulario (React Hook Form)**:   
    1. Onboarding con instrucciones antes de empezar   
    2. Tipo de comunidad (club o reta).    
    3. Nombre y descripción (escribir)   
    4. Ubicación (mapa de leaflet- lat y lng)   
    5. Imagenes (seleccion en dispositivo o tomar fotos).   
    6. Horarios (Conjuntos de días con horarios)   
    7. Servicios cercanos (Baños, wifi, tienda, transporte)   
    8. "paso condicional" - Seleccion unica de edad predominante (teens, young\_adults, veterans, mixed) si es tipo reta o seleccion multiple de categorias() si es tipo club.   
    9. Analizar formulario - La AI (gemini) se encarga de:   
        - Corroborar que las imagenes se traten de una cancha de basketball   
        - En base a las imagenes determinar si la cancha esta techada o no   
        - Determinar el tipo de suelo que tiene ( 'cement', 'parquet', 'asphalt', 'synthetic')   
        - Que el nombre y la descripción no sea un intento de spam, tenga malas intenciónes o sea falsa.   
    10. Dependiendo del resultado se ejecuta una acción:   
        - Aprobado - Se envia la información al backend (supabase), sale una notificación de envio correcto y se redirecciona a la pagina de la cancha registrada   
        - Rechazado - Se le describe la razón y aparecen 2 botones, uno para editar el formulario y otro para cancelar el registro de la comunidad.   
   
### A tener en cuenta   
- El formulario también debe de poner editar comunidades ya registradas, no solo registrar nuevas.   
- La data persiste mientras el usuario se encuentre en la ruta del formulario (/contribuir), si navega a otra ruta esta se borra (notificar al usuario de esto)   
- El formulario tiene 8 pasos visibles para el usuario , los que manejara el control de navegacion junto con el indicador del progreso. (pasos del 2 al 8).    
   
   
