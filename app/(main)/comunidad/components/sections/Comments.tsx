'use client';
import ItemContainer from '@/app/components/ui/containers/ItemList';
import HeadingSection from '../HeadingSection';

export default function CommentsSection() {
  const deleteComment = () => {
    console.log('comentario eliminado');
  };
  return (
    <div className="flex h-full w-full flex-col">
      <HeadingSection text="comentarios" />
      <div className="grow overflow-auto">
        <ItemContainer deleteFn={deleteComment}>
          <div className="gap-md flex">
            <figure className="bg-accent-primary h-[3rem] w-[3rem] rounded-[50%]"></figure>
            <div>
              <h3 className="text-4xl uppercase">Nombre del usuario</h3>
              <p className="text-2xs">este es un ejemplo de comentario perro</p>
            </div>
          </div>
        </ItemContainer>
      </div>
    </div>
  );
}
