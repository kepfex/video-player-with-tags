# 🎬 Reproductor de vídeo de entrevista inteligente

Un reproductor de video avanzado desarrollado en **React** y **TypeScript**, diseñado específicamente para optimizar la revisión de videoentrevistas.  

Este sistema permite a los reclutadores navegar únicamente por el contenido relevante (competencias), eliminando los tiempos muertos mediante una arquitectura de **Tiempo Virtual**.

🔗 **Demo en Vivo:**  
https://video-player-tags.netlify.app/

---

## 📸 Preview

![Smart Interview Video Player](./assets/PreviewVideoPlayerWithTags.PNG)

---

## 🚀 Utilidad del Proyecto

En el ecosistema de **Recursos Humanos**, la revisión de videoentrevistas suele ser ineficiente debido a los largos tiempos de grabación.  

Este proyecto resuelve ese problema mediante:

- ⏱ **Optimización del Tiempo:**  
  Filtra "intervalos basura" y entrega al usuario solo el contenido útil (etiquetado).

- 🎯 **Identificación Visual de Competencias:**  
  Permite ver exactamente dónde el candidato demuestra habilidades como *Liderazgo*, *Trabajo en Equipo* o *Comunicación*.

- ⌨️ **Navegación Inteligente:**  
  Proporciona un control total mediante teclado para saltar entre puntos de interés sin fricciones.

---

## 🛠️ Características Técnicas

### 1️⃣ Motor de Tiempo Virtual

Implementación de una capa de abstracción que mapea el `currentTime` real del video hacia una línea de tiempo virtual.  

Las secciones ocultas no existen para el usuario, lo que resulta en una experiencia de visualización fluida y continua.

---

### 2️⃣ Gestión de Solapamientos (Tracks)

Algoritmo de detección de colisiones que organiza las etiquetas en múltiples "pistas" cuando estas coinciden en el tiempo, garantizando que ninguna información visual se pierda.

---

### 3️⃣ Sistema de Snap Points

Navegación contextual que utiliza los bordes de las etiquetas como puntos de anclaje para los controles de **Anterior** y **Siguiente**.

---

## 💻 Stack Tecnológico

- ⚛️ **React 18** (Hooks, Custom Hooks, Context)
- 🔷 **TypeScript** (Definición de tipos estrictos para lógica de tiempo)
- 🎨 **Tailwind CSS** (Diseño moderno y responsivo)
- 🎯 **Lucide React / React Icons** (Sistemas de iconos)
- ⚡ **Vite** (Herramienta de construcción rápida)

---

## 📂 Estructura del Proyecto

- **src/hooks:** Lógica desacoplada (useVideoLogic useKeyboardNavigation).
- **src/utils/time.ts:** Cerebro matemático para conversiones Real ↔ Virtual.
- **src/components:** UI modular (Timeline, Controls, Player).
- **src/data:** Configuración de etiquetas y segmentos.

---

## ⌨️ Atajos de Teclado

- **Espacio:** Reproducir / Pausar  
- **Flecha Derecha:** Saltar al siguiente punto de interés (inicio/fin de tag)  
- **Flecha Izquierda:** Saltar al punto de interés anterior  

---

## 🛠️ Instalación y Configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/video-player-tags.git

### 2️⃣ Instalar dependencias

```bash
npm install

### 3️⃣ Ejecutar en desarrollo

```bash
npm run dev