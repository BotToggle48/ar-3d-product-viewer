import React, { useState, useEffect, useRef } from 'react';

const ProductViewer = () => {
  const canvasRef = useRef(null);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);
  const [scale, setScale] = useState(1);
  const [autoRotate, setAutoRotate] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f5f7fa');
      gradient.addColorStop(1, '#c3cfe2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3D Cube vertices
      const size = 80;
      const vertices = [
        [-size, -size, -size],
        [size, -size, -size],
        [size, size, -size],
        [-size, size, -size],
        [-size, -size, size],
        [size, -size, size],
        [size, size, size],
        [-size, size, size]
      ];

      // Convert to radians
      const rotX = (rotationX * Math.PI) / 180;
      const rotY = (rotationY * Math.PI) / 180;
      const rotZ = (rotationZ * Math.PI) / 180;

      // Apply rotations
      const rotatedVertices = vertices.map(([x, y, z]) => {
        let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
        let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
        let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
        let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);
        let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
        let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);
        return [x3, y3, z2];
      });

      // Project to 2D
      const projectedVertices = rotatedVertices.map(([x, y, z]) => {
        const perspective = 300 / (300 + z);
        return [x * perspective * scale, y * perspective * scale];
      });

      // Draw cube edges
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      ctx.strokeStyle = '#667eea';
      ctx.lineWidth = 2;

      edges.forEach(([start, end]) => {
        const [x1, y1] = projectedVertices[start];
        const [x2, y2] = projectedVertices[end];
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 + x1, canvas.height / 2 + y1);
        ctx.lineTo(canvas.width / 2 + x2, canvas.height / 2 + y2);
        ctx.stroke();
      });

      // Draw vertices
      ctx.fillStyle = '#764ba2';
      projectedVertices.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(canvas.width / 2 + x, canvas.height / 2 + y, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [rotationX, rotationY, rotationZ, scale]);

  const handleReset = () => {
    setRotationX(0);
    setRotationY(0);
    setRotationZ(0);
    setScale(1);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AR 3D Product Viewer</h1>
      <div style={styles.viewerSection}>
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          style={styles.canvas}
        />
        <div style={styles.controls}>
          <div style={styles.controlGroup}>
            <label>Rotation X: {Math.round(rotationX)}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotationX}
              onChange={(e) => setRotationX(parseFloat(e.target.value))}
              style={styles.slider}
            />
          </div>
          <div style={styles.controlGroup}>
            <label>Rotation Y: {Math.round(rotationY)}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotationY}
              onChange={(e) => setRotationY(parseFloat(e.target.value))}
              style={styles.slider}
            />
          </div>
          <div style={styles.controlGroup}>
            <label>Rotation Z: {Math.round(rotationZ)}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotationZ}
              onChange={(e) => setRotationZ(parseFloat(e.target.value))}
              style={styles.slider}
            />
          </div>
          <div style={styles.controlGroup}>
            <label>Scale: {scale.toFixed(1)}x</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              style={styles.slider}
            />
          </div>
          <button onClick={handleReset} style={styles.button}>
            Reset View
          </button>
          <button onClick={() => setAutoRotate(!autoRotate)} style={styles.button}>
            {autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  title: {
    fontSize: '2.5em',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center'
  },
  viewerSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    alignItems: 'center',
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '900px',
    width: '100%'
  },
  canvas: {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: '15px',
    padding: '20px'
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  slider: {
    width: '100%',
    height: '8px',
    cursor: 'pointer',
    accentColor: '#667eea'
  },
  button: {
    padding: '12px 24px',
    fontSize: '1em',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transition: 'all 0.3s ease'
  }
};

export default ProductViewer;
