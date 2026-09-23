//Componente Ventas
import { useEffect, useState } from 'react';
import { Container, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ id_cliente: '', total: '', estado: 'pendiente' });
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = () => {
    setCargando(true);
    Promise.all([api.get('/ventas'), api.get('/clientes')])
      .then(([resVentas, resClientes]) => {
        setVentas(resVentas.data);
        setClientes(resClientes.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la información de ventas');
        setCargando(false);
        console.error(err);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = {
        id_cliente: Number(form.id_cliente),
        total: Number(form.total),
        estado: form.estado
      };
      const response = await api.post('/ventas', payload);
      setVentas([...ventas, response.data]);
      setForm({ id_cliente: '', total: '', estado: 'pendiente' });
      setMostrarModal(false);
    } catch (err) {
      alert('Error al guardar la venta');
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  const badgeEstado = (estado) => {
    if (estado === 'completada') return 'success';
    if (estado === 'cancelada') return 'danger';
    return 'warning';
  };

  if (cargando) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando ventas...</p>
      </Container>
    );
  }

  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>
            <strong>Listado de Ventas</strong>{' '}
            <Badge bg="secondary">{ventas.length}</Badge>
          </span>
          <Button variant="primary" size="sm" onClick={() => setMostrarModal(true)}>
            + Nueva Venta
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(v => (
                <tr key={v.id_venta}>
                  <td>{v.id_venta}</td>
                  <td>{v.id_cliente}</td>
                  <td>{new Date(v.fecha_venta).toLocaleString('es-CO')}</td>
                  <td>${Number(v.total).toLocaleString('es-CO')}</td>
                  <td><Badge bg={badgeEstado(v.estado)}>{v.estado}</Badge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Nueva Venta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                name="id_cliente" value={form.id_cliente}
                onChange={handleChange} required
              >
                <option value="">Seleccione un cliente...</option>
                {clientes.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nomCliente}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total</Form.Label>
              <Form.Control
                type="number" name="total" value={form.total}
                onChange={handleChange} min="0" step="0.01" required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select name="estado" value={form.estado} onChange={handleChange}>
                <option value="pendiente">Pendiente</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </Form.Select>
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

export default Ventas;