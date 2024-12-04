"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

export default function Paginator({
  totalPages = 1,
  currentPage = 1,
  onChangePage = async () => {},
}: {
  totalPages: number;
  currentPage: number;
  onChangePage?: () => Promise<void>;
}) {
  return (
    <Pagination className="w-full justify-end">
      <PaginationContent>
        {(() => {
          const pagesToShow = 6;
          const paginationItems = [];

          // Sembunyikan tombol Previous di halaman pertama
          if (currentPage > 1) {
            paginationItems.push(
              <PaginationItem onClick={onChangePage} key="previous">
                <PaginationPrevious href={`?page=${currentPage - 1}`} />
              </PaginationItem>
            );
          }

          if (totalPages <= pagesToShow) {
            // Tampilkan semua halaman jika total halaman <= 6
            for (let i = 1; i <= totalPages; i++) {
              paginationItems.push(
                <PaginationItem onClick={onChangePage} key={i}>
                  <PaginationLink
                    isActive={i === currentPage}
                    href={`?page=${i}`}
                  >
                    {i}
                  </PaginationLink>
                </PaginationItem>
              );
            }
          } else {
            // Elipsis untuk halaman awal jika terlalu jauh dari halaman aktif
            if (currentPage > 3) {
              paginationItems.push(
                <PaginationItem onClick={onChangePage} key="start-ellipsis">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else {
              paginationItems.push(
                <PaginationItem onClick={onChangePage} key={1}>
                  <PaginationLink isActive={currentPage === 1} href={`?page=1`}>
                    1
                  </PaginationLink>
                </PaginationItem>
              );
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
              paginationItems.push(
                <PaginationItem onClick={onChangePage} key={i}>
                  <PaginationLink
                    isActive={i === currentPage}
                    href={`?page=${i}`}
                  >
                    {i}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            // Elipsis untuk halaman akhir jika terlalu jauh dari halaman aktif
            if (currentPage < totalPages - 2) {
              paginationItems.push(
                <PaginationItem onClick={onChangePage} key="end-ellipsis">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else {
              paginationItems.push(
                <PaginationItem onClick={onChangePage} key={totalPages}>
                  <PaginationLink
                    isActive={currentPage === totalPages}
                    href={`?page=${totalPages}`}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              );
            }
          }

          // Sembunyikan tombol Next di halaman terakhir
          if (currentPage < totalPages) {
            paginationItems.push(
              <PaginationItem onClick={onChangePage} key="next">
                <PaginationNext href={`?page=${currentPage + 1}`} />
              </PaginationItem>
            );
          }

          return paginationItems;
        })()}
      </PaginationContent>
    </Pagination>
  );
}
