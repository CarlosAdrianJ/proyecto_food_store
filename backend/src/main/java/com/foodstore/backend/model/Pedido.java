package com.foodstore.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Pedido extends Base {

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fechaPedido;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private FormaPago formaPago;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles = new ArrayList<>();

    @PrePersist
    public void inicializarPedido() {
        if (fechaPedido == null) {
            fechaPedido = LocalDateTime.now();
        }

        if (estado == null) {
            estado = EstadoPedido.PENDIENTE;
        }

        recalcularTotal();
    }

    public void addDetalle(DetallePedido detalle) {
        if (detalle == null) {
            return;
        }

        detalle.setPedido(this);
        detalle.recalcularSubtotal();
        this.detalles.add(detalle);
        recalcularTotal();
    }

    public void removeDetalle(DetallePedido detalle) {
        if (detalle == null) {
            return;
        }

        this.detalles.remove(detalle);
        detalle.setPedido(null);
        recalcularTotal();
    }

    public void clearDetalles() {
        for (DetallePedido detalle : detalles) {
            detalle.setPedido(null);
        }
        detalles.clear();
        recalcularTotal();
    }

    public void recalcularTotal() {
        BigDecimal nuevoTotal = BigDecimal.ZERO;

        for (DetallePedido detalle : detalles) {
            detalle.recalcularSubtotal();
            if (detalle.getSubtotal() != null) {
                nuevoTotal = nuevoTotal.add(detalle.getSubtotal());
            }
        }

        this.total = nuevoTotal.setScale(2, RoundingMode.HALF_UP);
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public FormaPago getFormaPago() {
        return formaPago;
    }

    public void setFormaPago(FormaPago formaPago) {
        this.formaPago = formaPago;
    }

    public List<DetallePedido> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles.clear();

        if (detalles != null) {
            for (DetallePedido detalle : detalles) {
                addDetalle(detalle);
            }
        }

        recalcularTotal();
    }
}