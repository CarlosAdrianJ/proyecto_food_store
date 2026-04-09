package com.foodstore.backend.repository;

import com.foodstore.backend.model.Base;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public class BaseRepositoryImpl<T extends Base>
        extends SimpleJpaRepository<T, Long>
        implements BaseRepository<T> {

    private final EntityManager entityManager;
    private final Class<T> domainClass;

    public BaseRepositoryImpl(JpaEntityInformation<T, ?> entityInformation,
                              EntityManager entityManager) {
        super(entityInformation, entityManager);
        this.entityManager = entityManager;
        this.domainClass = entityInformation.getJavaType();
    }

    @Override
    public List<T> findAll() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(domainClass);
        Root<T> root = cq.from(domainClass);

        cq.select(root).where(cb.isFalse(root.get("eliminado")));

        TypedQuery<T> query = entityManager.createQuery(cq);
        return query.getResultList();
    }

    @Override
    public Optional<T> findById(Long id) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(domainClass);
        Root<T> root = cq.from(domainClass);

        cq.select(root).where(
                cb.and(
                        cb.equal(root.get("id"), id),
                        cb.isFalse(root.get("eliminado"))
                )
        );

        List<T> results = entityManager.createQuery(cq).getResultList();
        return results.stream().findFirst();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        T entity = findByIdOrThrow(id);
        entity.setEliminado(true);
        entityManager.merge(entity);
    }
}