//Componente Productos
import { useEffect, useState } from 'react';
import { Container, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ nomProducto: '', cantidad: '', precio: '' });
  const [guardando, setGuardando] = useState(false);

  const cargarProductos = () => {
    setCargando(true);
    api.get('/productos')
      .then(response => {
        setProductos(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de productos');
        setCargando(false);
        console.error(err);
      });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = {
        nomProducto: form.nomProducto,
        cantidad: Number(form.cantidad) || 0,
        precio: Number(form.precio)
      };
      const response = await api.post('/productos', payload);
      setProductos([...productos, response.data]);
      setForm({ nomProducto: '', cantidad: '', precio: '' });
      setMostrarModal(false);
    } catch (err) {
      alert('Error al guardar el producto');
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando productos...</p>
      </Container>
    );
  }

  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>
            <strong>Listado de Productos</strong>{' '}
            <Badge bg="secondary">{productos.length}</Badge>
          </span>
          <Button variant="primary" size="sm" onClick={() => setMostrarModal(true)}>
            + Nuevo Producto
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id_producto}>
                  <td>{p.id_producto}</td>
                  <td>{p.nomProducto}</td>
                  <td>
                    <Badge bg={p.cantidad > 0 ? 'success' : 'danger'}>
                      {p.cantidad}
                    </Badge>
                  </td>
                  <td>${Number(p.precio).toLocaleString('es-CO')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Nuevo Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text" name="nomProducto" value={form.nomProducto}
                onChange={handleChange} required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number" name="cantidad" value={form.cantidad}
                onChange={handleChange} min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number" name="precio" value={form.precio}
                onChange={handleChange} min="0" step="0.01" required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Productos;