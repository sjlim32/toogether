import { Form } from 'react-router-dom';

interface Contact {
  first: string;
  last: string;
  avatar: string;
  twitter?: string; // Optional because not all contacts might have a Twitter handle
  notes?: string; // Optional because notes might not always be provided
  favorite: boolean;
}

export default function Contact() {
  const contact: Contact = {
    first: 'Your',
    last: 'Name',
    avatar: 'https://placekitten.com/g/200/200',
    twitter: 'your_handle',
    notes: 'Some notes',
    favorite: true,
  };

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || undefined} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
              rel="noreferrer"
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

type FavoriteProps = {
  contact: Contact;
};

function Favorite({ contact }: FavoriteProps) {
  // yes, this is a `let` for later
  const favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </Form>
  );
}