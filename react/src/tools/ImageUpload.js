import React, { Component } from "react";

class ImageUpload extends Component {
    imageClick = () => {
        this.refs.fileInput.click();
    }

    imageSelect = () => {
        this.getBase64(this.refs.fileInput.files[0], image => {
            if (image && this.props.onChange) {
                this.props.onChange(image)
            }
        })
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    render() {
        return (
            <div>
                <img src={this.props.src} alt="" height="100" onClick={this.imageClick} />
                <input type="file" ref="fileInput" className="upload" accept="*" onChange={this.imageSelect} style={{ display: "none" }} />
            </div>
        )
    }
}

export default ImageUpload
