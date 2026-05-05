package com.foodstore.backend.service;

import com.foodstore.backend.dto.DetallePedidoCreate;
import com.foodstore.backend.dto.DetallePedidoDto;
import com.foodstore.backend.dto.PedidoCreate;
import com.foodstore.backend.dto.PedidoDto;
import com.foodstore.backend.dto.PedidoUpdate;
import com.foodstore.backend.exception.BusinessException;
import com.foodstore.backend.exception.ResourceNotFoundException;
import com.foodstore.backend.model.DetallePedido;
import com.foodstore.backend.model.EstadoPedido;
import com.foodstore.backend.model.Pedido;
import com.foodstore.backend.model.Producto;
import com.foodstore.backend.model.Usuario;
import com.foodstore.backend.repository.PedidoRepository;
import com.foodstore.backend.repository.ProductoRepository;
import com.foodstore.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         UsuarioRepository usuarioRepository,
                         ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional
    public PedidoDto create(PedidoCreate dto) {
        Usuario usuario = usuarioRepository.findByIdOrThrow(dto.usuarioId());

        if (dto.detalles() == null || dto.detalles().isEmpty()) {
            throw new BusinessException("El pedido debe tener al menos un detalle");
        }

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFormaPago(dto.formaPago());
        pedido.setEstado(EstadoPedido.PENDIENTE);

        Set<Long> productosProcesados = new HashSet<>();

        for (DetallePedidoCreate detalleDto : dto.detalles()) {
            if (!productosProcesados.add(detalleDto.productoId())) {
                throw new BusinessException("No se puede repetir el mismo producto en el pedido");
            }

            Producto producto = productoRepository.findByIdForUpdate(detalleDto.productoId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No se encontró el producto con id: " + detalleDto.productoId()
                    ));

            if (Boolean.FALSE.equals(producto.getDisponible())) {
                throw new BusinessException(
                        "El producto '" + producto.getDenominacion() + "' no está disponible"
                );
            }

            if (producto.getStock() == null || producto.getStock() < detalleDto.cantidad()) {
                throw new BusinessException(
                        "Stock insuficiente para el producto '" + producto.getDenominacion() + "'"
                );
            }

            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDto.cantidad());
            detalle.setPrecioUnitario(producto.getPrecio());

            pedido.addDetalle(detalle);

            producto.setStock(producto.getStock() - detalleDto.cantidad());
        }

        pedido.recalcularTotal();

        Pedido saved = pedidoRepository.save(pedido);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<PedidoDto> findAll() {
        return pedidoRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Pedido::getFechaPedido).reversed())
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoDto findById(Long id) {
        Pedido pedido = pedidoRepository.findByIdOrThrow(id);
        return toDto(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoDto> findByUser(Long usuarioId) {
        usuarioRepository.findByIdOrThrow(usuarioId);

        return pedidoRepository.findByUsuarioIdAndEliminadoFalseOrderByFechaPedidoDesc(usuarioId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public PedidoDto update(Long id, PedidoUpdate dto) {
        Pedido pedido = pedidoRepository.findByIdOrThrow(id);

        pedido.setEstado(dto.estado());
        pedido.setFormaPago(dto.formaPago());

        Pedido updated = pedidoRepository.save(pedido);
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        pedidoRepository.findByIdOrThrow(id);
        pedidoRepository.deleteById(id);
    }

    private PedidoDto toDto(Pedido pedido) {
        return new PedidoDto(
                pedido.getId(),
                pedido.getUsuario().getId(),
                pedido.getUsuario().getNombre() + " " + pedido.getUsuario().getApellido(),
                pedido.getUsuario().getEmail(),
                pedido.getFechaPedido(),
                pedido.getTotal(),
                pedido.getEstado(),
                pedido.getFormaPago(),
                pedido.getDetalles().stream().map(this::toDetalleDto).toList(),
                pedido.getCreatedAt(),
                pedido.getUpdatedAt(),
                pedido.getVersion()
        );
    }

    private DetallePedidoDto toDetalleDto(DetallePedido detalle) {
        return new DetallePedidoDto(
                detalle.getId(),
                detalle.getProducto().getId(),
                detalle.getProducto().getDenominacion(),
                detalle.getCantidad(),
                detalle.getPrecioUnitario(),
                detalle.getSubtotal()
        );
    }
}