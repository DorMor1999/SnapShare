from azure.storage.blob import BlobServiceClient

def get_Photos(event_photos_keys, event_id):
    # Fetch credentials from environment variables in config
    from app import app
    account_name = app.config.get('ACCOUNT_NAME_STORAGE')
    account_key = app.config.get('ACCOUNT_KEY_STORAGE')
    container_name = app.config.get('CONTAINER_NAME_STORAGE')

    # Construct the connection string using account_name and account_key
    connect_str = f"DefaultEndpointsProtocol=https;AccountName={account_name};AccountKey={account_key};EndpointSuffix=core.windows.net"

    # Initialize the BlobServiceClient
    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    container_client = blob_service_client.get_container_client(container_name)
    photos = []

    # List and filter the blobs based on the provided keys and event path
    for blob in container_client.list_blobs():
        # Check if the blob path matches the desired event structure
        blob_pId=extract_photo_id(blob.name)
        if blob.name.startswith(f"events/{event_id}/") and blob_pId in [extract_photo_id(key['photoUrl']) for key in event_photos_keys]:
            # Get the blob client for the current photo
            blob_client = container_client.get_blob_client(blob.name)
            # Download the blob's content as bytes
            photo_bytes = blob_client.download_blob().readall()
           
            # Append the photo bytes and key to the photos list
            photos.append({
            "photo_bytes": photo_bytes,
            "photo_key": blob.name.split("/")[-1],  # Extract just the photo key (the last part)
            "photo_id": blob_pId
            })

    return photos


def extract_photo_id(blob_name: str) -> str:
    resultPhotoId=blob_name.split("/")[-1].rsplit(".", 1)[0]
    return resultPhotoId
